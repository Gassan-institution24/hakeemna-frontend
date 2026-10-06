import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

// ── Clinic ───────────────────────────────────────────────────────────────────

export function useGetPatientLabRequests(uspId) {
  const URL = endpoints.labRequests.byPatient(uspId);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      labRequests: data?.data || [],
      loading: isLoading,
      error,
      validating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return { ...memoizedValue, refetch: () => mutate(URL) };
}

export async function createLabRequest(payload) {
  const res = await axiosInstance.post(endpoints.labRequests.create, payload);
  return res.data?.data;
}

export async function updateLabRequest(id, payload) {
  const res = await axiosInstance.patch(endpoints.labRequests.one(id), payload);
  return res.data?.data;
}

export async function deleteLabRequest(id) {
  await axiosInstance.delete(endpoints.labRequests.one(id));
}

export async function uploadLabRequestImages(id, files, caption) {
  const formData = new FormData();
  files.forEach((file) => formData.append('file', file));
  if (caption) formData.append('caption', caption);
  const res = await axiosInstance.post(endpoints.labRequests.images(id), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data?.data;
}

export async function deleteLabRequestImage(id, imageId) {
  const res = await axiosInstance.delete(endpoints.labRequests.image(id, imageId));
  return res.data?.data;
}

export async function addLabRequestMessage(id, text) {
  const res = await axiosInstance.post(endpoints.labRequests.messages(id), { text });
  return res.data?.data;
}

export async function regenerateLabRequestLink(id) {
  const res = await axiosInstance.post(endpoints.labRequests.regenerate(id));
  return res.data?.data;
}

export const labRequestShareUrl = (token) => `${window.location.origin}/lab-request/${token}`;

// ── Lab (public, shared link) ─────────────────────────────────────────────────

export function useGetSharedLabRequest(token) {
  const URL = endpoints.labRequests.shared(token);

  const { data, isLoading, error } = useSWR(URL, fetcher, { shouldRetryOnError: false });

  return {
    labRequest: data?.data || null,
    loading: isLoading,
    error,
    refetch: () => mutate(URL),
  };
}

const setShared = (token, data) =>
  mutate(endpoints.labRequests.shared(token), { status: 'success', data }, false);

export async function updateSharedLabRequest(token, payload) {
  const res = await axiosInstance.patch(endpoints.labRequests.shared(token), payload);
  await setShared(token, res.data?.data);
  return res.data?.data;
}

export async function addSharedLabMessage(token, payload) {
  const res = await axiosInstance.post(endpoints.labRequests.sharedMessages(token), payload);
  await setShared(token, res.data?.data);
  return res.data?.data;
}

export async function uploadSharedLabImages(token, files, { caption, author_name } = {}) {
  const formData = new FormData();
  files.forEach((file) => formData.append('file', file));
  if (caption) formData.append('caption', caption);
  if (author_name) formData.append('author_name', author_name);
  const res = await axiosInstance.post(endpoints.labRequests.sharedImages(token), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  await setShared(token, res.data?.data);
  return res.data?.data;
}
