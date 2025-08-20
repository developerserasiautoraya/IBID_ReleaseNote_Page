import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import type { ConfluenceApiError } from "~/types/confluence";

export class ConfluenceApi {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: '/api/confluence',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Basic ${btoa(`${import.meta.env.VITE_CONFLUENCE_EMAIL}:${import.meta.env.VITE_CONFLUENCE_API_TOKEN}`)}`
      }
    })

    this.api.interceptors.response.use(
			(response: AxiosResponse) => response,
			(error) => {
				if (error.response) {
					const confluenceError: ConfluenceApiError = {
						statusCode: error.response.status,
						data: error.response.data,
						message: error.response.data?.message || error.message,
						reason: error.response.statusText
					}
					throw confluenceError
				}
				throw error
			}
		)
  }

  async getPages() {
    const response = await this.api.get('/pages');
    return response.data;
  }

  async getConfluenceChildPages(pageId: number) {
    const response = await this.api.get(`/pages/${pageId}/children`);
    return response.data;
  }

  async getConfluencePageById(pageId: string) {
  const response = await this.api.get(`/pages/${pageId}?body-format=styled_view`, {
    headers: { "Cache-Control": "no-cache" }
  });
  return response.data;
}

}