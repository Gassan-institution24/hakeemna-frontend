import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

// ── Templates (superadmin builds, one per speciality) ────────────────────────

export function useGetQuestionnaireTemplates() {
  const URL = endpoints.questionnaires.templates;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      templates: data || [],
      loading: isLoading,
      error,
      validating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return { ...memoizedValue, refetch: () => mutate(URL) };
}

export function useGetQuestionnaireTemplate(id) {
  const URL = endpoints.questionnaires.template(id);

  const { data, isLoading, error } = useSWR(URL, fetcher);

  return useMemo(() => ({ template: data, loading: isLoading, error }), [data, error, isLoading]);
}

export async function saveQuestionnaireTemplate(id, payload) {
  const res = id
    ? await axiosInstance.patch(endpoints.questionnaires.template(id), payload)
    : await axiosInstance.post(endpoints.questionnaires.templates, payload);
  mutate(endpoints.questionnaires.templates);
  return res.data;
}

// ── Clinic (switch templates on, add clinic questions) ──────────────────────

export function useGetClinicQuestionnaires() {
  const URL = endpoints.questionnaires.clinic;

  const { data, isLoading, error } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      templates: data?.templates || [],
      speciality: data?.speciality || null,
      loading: isLoading,
      error,
    }),
    [data, error, isLoading]
  );

  return { ...memoizedValue, refetch: () => mutate(URL) };
}

// The clinic's own questionnaire: created switched on, visible only to this clinic.
export async function saveOwnQuestionnaire(id, payload) {
  const res = id
    ? await axiosInstance.patch(endpoints.questionnaires.ownOne(id), payload)
    : await axiosInstance.post(endpoints.questionnaires.own, payload);
  mutate(endpoints.questionnaires.clinic);
  return res.data;
}

export async function deleteOwnQuestionnaire(id) {
  await axiosInstance.delete(endpoints.questionnaires.ownOne(id));
  mutate(endpoints.questionnaires.clinic);
}

export async function saveClinicQuestionnaire(templateId, payload) {
  const res = await axiosInstance.put(endpoints.questionnaires.clinicTemplate(templateId), payload);
  mutate(endpoints.questionnaires.clinic);
  return res.data;
}

// ── Patient ──────────────────────────────────────────────────────────────────

export function useGetPatientQuestionnaires(uspId, lang) {
  const URL = endpoints.questionnaires.patientForms(uspId);
  const key = URL ? [URL, { params: { lang } }] : null;

  const { data, isLoading, error } = useSWR(key, fetcher);

  const memoizedValue = useMemo(
    () => ({ forms: data || [], loading: isLoading, error }),
    [data, error, isLoading]
  );

  return { ...memoizedValue, refetch: () => mutate(key) };
}

export function useGetPatientQuestionnaireResponses(uspId, entrance) {
  const URL = endpoints.questionnaires.patientResponses(uspId);
  const key = URL ? [URL, { params: entrance ? { entrance } : {} }] : null;

  const { data, isLoading, error } = useSWR(key, fetcher);

  const memoizedValue = useMemo(
    () => ({ responses: data || [], loading: isLoading, error }),
    [data, error, isLoading]
  );

  return { ...memoizedValue, refetch: () => mutate(key) };
}

export async function submitQuestionnaireResponse(payload) {
  const res = await axiosInstance.post(endpoints.questionnaires.responses, payload);
  return res.data;
}

export async function updateQuestionnaireResponse(id, answers) {
  const res = await axiosInstance.patch(endpoints.questionnaires.response(id), { answers });
  return res.data;
}
