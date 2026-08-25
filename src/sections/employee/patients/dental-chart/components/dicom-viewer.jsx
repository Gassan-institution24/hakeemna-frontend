/* eslint-disable import/no-extraneous-dependencies, import/extensions */
// cornerstone-core, cornerstone-wado-image-loader and dicom-parser are declared in
// package.json; eslint-plugin-import fails to resolve them under the CRA build's
// eslint pass, so the rule is turned off for this file's imports only.
import PropTypes from 'prop-types';
import dicomParser from 'dicom-parser';
import cornerstone from 'cornerstone-core';
import { useRef, useState, useEffect, useCallback } from 'react';
// The package's default entry decodes *every* transfer syntax by dispatching to a
// web worker (imageLoader/decodeImageFrame.js has no main-thread branch), and its
// dynamic-import build expects .worker.js and .wasm files to be served next to the
// bundle — which CRA never copies out of node_modules. This build inlines the
// worker and all codecs, so compressed DICOM (JPEG Lossless, JPEG-LS, JPEG 2000)
// decodes with nothing extra to host.
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader/dist/cornerstoneWADOImageLoaderNoWebWorkers.bundle.min.js';
/* eslint-enable import/no-extraneous-dependencies, import/extensions */

import { Box, Stack, Slider, Tooltip, Typography, IconButton, CircularProgress } from '@mui/material';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

// Wire cornerstone's externals once per page load.
let initialised = false;
function initCornerstone() {
  if (initialised) return;
  cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
  cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
  initialised = true;
}

// A handful of DICOM tags worth showing under the image.
const TAG_PATIENT_NAME = 'x00100010';
const TAG_STUDY_DATE = 'x00080020';
const TAG_MODALITY = 'x00080060';

function readTags(image) {
  const dataSet = image?.data;
  if (!dataSet || typeof dataSet.string !== 'function') return null;
  try {
    return {
      patientName: dataSet.string(TAG_PATIENT_NAME) || null,
      studyDate: dataSet.string(TAG_STUDY_DATE) || null,
      modality: dataSet.string(TAG_MODALITY) || null,
    };
  } catch (e) {
    return null;
  }
}

// ----------------------------------------------------------------------

export default function DicomViewer({ url, lang }) {
  const isAr = lang === 'ar';
  const elementRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tags, setTags] = useState(null);
  // Window width / window center drive contrast and brightness respectively.
  const [windowWidth, setWindowWidth] = useState(null);
  const [windowCenter, setWindowCenter] = useState(null);

  useEffect(() => {
    initCornerstone();
    const element = elementRef.current;
    if (!element || !url) return undefined;

    let cancelled = false;
    cornerstone.enable(element);
    setLoading(true);
    setError('');

    cornerstone
      .loadImage(`wadouri:${url}`)
      .then((image) => {
        if (cancelled) return;
        const viewport = cornerstone.getDefaultViewportForImage(element, image);
        cornerstone.displayImage(element, image, viewport);
        cornerstone.fitToWindow(element);
        setWindowWidth(viewport.voi.windowWidth);
        setWindowCenter(viewport.voi.windowCenter);
        setTags(readTags(image));
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('DICOM load error:', err);
        setError(err?.message || 'Failed to load DICOM file');
        setLoading(false);
      });

    // The viewer mounts inside a dialog that is still animating open, so the
    // element can measure 0×0 when the image is first displayed. Re-fit on every
    // size change to keep the image correctly scaled.
    const observer = new ResizeObserver(() => {
      try {
        cornerstone.resize(element, true);
      } catch (e) {
        // Nothing displayed yet.
      }
    });
    observer.observe(element);

    return () => {
      cancelled = true;
      observer.disconnect();
      try {
        cornerstone.disable(element);
      } catch (e) {
        // The element may already be detached — nothing to clean up.
      }
    };
  }, [url]);

  // Every control mutates the live viewport, so guard against the not-yet-loaded state.
  const withViewport = useCallback((fn) => {
    const element = elementRef.current;
    if (!element) return;
    let viewport;
    try {
      viewport = cornerstone.getViewport(element);
    } catch (e) {
      return;
    }
    if (!viewport) return;
    fn(viewport);
    cornerstone.setViewport(element, viewport);
  }, []);

  const handleZoom = useCallback(
    (factor) => withViewport((vp) => { vp.scale *= factor; }),
    [withViewport]
  );

  const handleInvert = useCallback(
    () => withViewport((vp) => { vp.invert = !vp.invert; }),
    [withViewport]
  );

  const handleReset = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;
    try {
      cornerstone.reset(element);
      cornerstone.fitToWindow(element);
      const vp = cornerstone.getViewport(element);
      setWindowWidth(vp.voi.windowWidth);
      setWindowCenter(vp.voi.windowCenter);
    } catch (e) {
      // Nothing displayed yet.
    }
  }, []);

  const handleWindowWidth = useCallback(
    (_, value) => {
      setWindowWidth(value);
      withViewport((vp) => { vp.voi.windowWidth = value; });
    },
    [withViewport]
  );

  const handleWindowCenter = useCallback(
    (_, value) => {
      setWindowCenter(value);
      withViewport((vp) => { vp.voi.windowCenter = value; });
    },
    [withViewport]
  );

  return (
    <Stack sx={{ height: '100%', minHeight: 0 }} gap={1}>
      <Stack direction="row" alignItems="center" gap={0.5} flexWrap="wrap">
        <Tooltip title={isAr ? 'تكبير' : 'Zoom in'}>
          <IconButton size="small" onClick={() => handleZoom(1.25)}>
            <Iconify icon="solar:magnifer-zoom-in-bold" width={18} />
          </IconButton>
        </Tooltip>
        <Tooltip title={isAr ? 'تصغير' : 'Zoom out'}>
          <IconButton size="small" onClick={() => handleZoom(0.8)}>
            <Iconify icon="solar:magnifer-zoom-out-bold" width={18} />
          </IconButton>
        </Tooltip>
        <Tooltip title={isAr ? 'عكس الألوان' : 'Invert'}>
          <IconButton size="small" onClick={handleInvert}>
            <Iconify icon="solar:sun-2-bold" width={18} />
          </IconButton>
        </Tooltip>
        <Tooltip title={isAr ? 'إعادة تعيين' : 'Reset'}>
          <IconButton size="small" onClick={handleReset}>
            <Iconify icon="solar:restart-bold" width={18} />
          </IconButton>
        </Tooltip>

        {windowWidth != null && (
          <Stack direction="row" alignItems="center" gap={1} sx={{ ml: 1, minWidth: 160, flex: 1 }}>
            <Typography variant="caption" color="text.secondary" noWrap>
              {isAr ? 'التباين' : 'Contrast'}
            </Typography>
            <Slider
              size="small"
              value={Number(windowWidth) || 0}
              min={1}
              max={4000}
              onChange={handleWindowWidth}
            />
          </Stack>
        )}

        {windowCenter != null && (
          <Stack direction="row" alignItems="center" gap={1} sx={{ minWidth: 160, flex: 1 }}>
            <Typography variant="caption" color="text.secondary" noWrap>
              {isAr ? 'السطوع' : 'Brightness'}
            </Typography>
            <Slider
              size="small"
              value={Number(windowCenter) || 0}
              min={-1000}
              max={3000}
              onChange={handleWindowCenter}
            />
          </Stack>
        )}
      </Stack>

      <Box sx={{ position: 'relative', flex: 1, minHeight: 320, backgroundColor: 'common.black' }}>
        {/* cornerstone paints into this element; it must not be React-managed inside. */}
        <Box
          ref={elementRef}
          sx={{ width: '100%', height: '100%', minHeight: 320 }}
          onContextMenu={(e) => e.preventDefault()}
        />

        {loading && (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ position: 'absolute', inset: 0 }}
          >
            <CircularProgress size={28} sx={{ color: 'common.white' }} />
          </Stack>
        )}

        {error && (
          <Stack
            alignItems="center"
            justifyContent="center"
            gap={1}
            sx={{ position: 'absolute', inset: 0, p: 2 }}
          >
            <Iconify icon="solar:danger-triangle-bold" width={28} sx={{ color: 'error.main' }} />
            <Typography variant="caption" sx={{ color: 'common.white' }} textAlign="center">
              {isAr ? 'تعذر عرض ملف DICOM' : 'Could not render this DICOM file'}
            </Typography>
            <Typography variant="caption" color="text.disabled" textAlign="center">
              {error}
            </Typography>
          </Stack>
        )}
      </Box>

      {tags && (
        <Typography variant="caption" color="text.secondary">
          {[tags.modality, tags.patientName, tags.studyDate].filter(Boolean).join(' · ')}
        </Typography>
      )}
    </Stack>
  );
}

DicomViewer.propTypes = {
  url: PropTypes.string,
  lang: PropTypes.string,
};
