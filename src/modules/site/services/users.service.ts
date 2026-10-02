import { api } from "@/shared/services/api";
import { toHttpError } from "@/shared/services/http-error";
import type { ReviewPage } from "@/shared/types/review";
import type { PublicProfile, UserPreferences } from "@/shared/types/user";

export const UsersService = {
  /** GET /users/{username} — perfil público. Devolve null se não existir (ou estiver inativo). */
  getProfile: async (username: string): Promise<PublicProfile | null> => {
    try {
      const response = await api.request<PublicProfile>({
        url: `/users/${encodeURIComponent(username)}`,
        method: "GET",
      });
      return response.data;
    } catch (er) {
      const error = toHttpError(er);
      if (error.status === 404) return null;
      throw error;
    }
  },

  /** GET /users/{username}/reviews — avaliações visíveis do usuário. */
  listReviews: async (username: string, page = 0, size = 10): Promise<ReviewPage> => {
    try {
      const response = await api.request<ReviewPage>({
        url: `/users/${encodeURIComponent(username)}/reviews`,
        method: "GET",
        params: { page, size },
      });
      return response.data;
    } catch (er) {
      throw toHttpError(er);
    }
  },

  /** GET /user/me/preferences */
  getPreferences: async (): Promise<UserPreferences> => {
    try {
      const response = await api.request<UserPreferences>({ url: "/user/me/preferences", method: "GET" });
      return response.data;
    } catch (er) {
      throw toHttpError(er);
    }
  },

  /** PATCH /user/me/preferences */
  updatePreferences: async (prefs: UserPreferences): Promise<UserPreferences> => {
    try {
      const response = await api.request<UserPreferences>({
        url: "/user/me/preferences",
        method: "PATCH",
        data: prefs,
      });
      return response.data;
    } catch (er) {
      throw toHttpError(er);
    }
  },
};
