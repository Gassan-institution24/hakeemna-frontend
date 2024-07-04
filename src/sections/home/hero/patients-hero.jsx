import { m } from 'framer-motion';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import { Button } from '@mui/material';
import Typography from '@mui/material/Typography';

import { useResponsive } from 'src/hooks/use-responsive';

import { useLocales, useTranslate } from 'src/locales';

import { varFade } from 'src/components/animate';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function PatientsHero({ currentPage, setCurrentPage }) {
    const mdUp = useResponsive('up', 'md');
    const { t } = useTranslate();
    const { currentLang } = useLocales();
    const curLangAr = currentLang.value === 'ar';
    const router = useRouter();

    const renderDescription = (
        <>
            <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                    height: 1,
                    maxWidth: 600,
                    zIndex: 2,
                    px: 3,
                }}
            >
                <m.div variants={varFade().in}>
                    <Typography
                        variant="h3"
                        sx={{
                            textAlign: 'center',
                            fontFamily: curLangAr ? 'Beiruti, sans-serif' : 'Playwrite US Modern, cursive',
                            fontWeight: 700,
                            fontSize: { xs: 35, md: 50 },
                            // textShadow: '5px 5px 5px black',
                            mb: 3,
                        }}
                    >
                        {t('beneficiary')}
                    </Typography>
                </m.div>

                <m.div variants={varFade().in}>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            textAlign: 'center',
                            //  textShadow: '5px 5px 5px black'
                        }}
                    >
                        {t(
                            'It provides integrated services to patients in terms of storing data and medical information and managing them in a flexible manner, thus facilitating the mechanism of accessing information, medical history and other data at any time and in communicating with the medical staff in an efficient manner.'
                        )}
                    </Typography>
                </m.div>

                <br />
                <Stack direction={{ sx: 'column', md: 'row' }} gap={1}>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ borderRadius: 0, mx: { md: 2 }, width: 170, py: 1, textTransform: 'uppercase' }}
                        onClick={() => router.push(paths.auth.register)}
                    >
                        {t('join now')}
                    </Button>
                    <Button
                        variant="outlined"
                        sx={{ borderRadius: 0, width: 170, py: 1 }}
                        onClick={() => setCurrentPage('doctors')}
                    >
                        {t('read more')}
                    </Button>
                </Stack>
                <br />
            </Stack>
            {
                !mdUp && (
                    <Stack direction='row' width={1} >
                        <Button
                            variant="contained"
                            // color="primary"
                            sx={{ borderRadius: 0, width: '50%', py: 1.5 }}
                            onClick={() => setCurrentPage('home')}
                        >
                            {t('home')}
                        </Button>
                        <Button
                            variant="contained"
                            color="info"
                            sx={{ borderRadius: 0, flex: 1, py: 1.5 }}
                            onClick={() => setCurrentPage('doctors')}
                        >
                            {t('unit of Serivce')}
                        </Button>
                    </Stack>
                )
            }
        </>
    );

    return (
        <Stack
            justifyContent="center"
            alignItems="center"
            width={1}
            height={1}
            sx={{
                position: 'absolute',
                bottom: 0,
                ...(curLangAr ? { left: 0 } : { right: 0 }),
                borderRadius: currentPage === 'users' ? 0 : '50% 0 0 0',
                width: currentPage === 'users' ? '100%' : 0,
                height: currentPage === 'users' ? '100%' : 0,
                transition: 'all 0.5s ease-in-out',
                zIndex: 1,
                backgroundColor: { md: '#d5f7e6' },
                overflow: 'hidden',
            }}
        >
            {renderDescription}
        </Stack>
    );
}
PatientsHero.propTypes = {
    currentPage: PropTypes.string,
    setCurrentPage: PropTypes.func,
};
