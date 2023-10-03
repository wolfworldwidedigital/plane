// services
import APIService from "services/api.service";
// types
import { ICustomAttribute, ICustomAttributeValue, ICustomAttributeValueFormData } from "types";

const { NEXT_PUBLIC_API_BASE_URL } = process.env;

class CustomAttributesService extends APIService {
  constructor() {
    super(NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000");
  }

  async getObjectsList(
    workspaceSlug: string,
    params: { project: string }
  ): Promise<ICustomAttribute[]> {
    return this.get(`/api/workspaces/${workspaceSlug}/entity-properties/`, {
      params,
    })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async getAttributeDetails(workspaceSlug: string, propertyId: string): Promise<ICustomAttribute> {
    return this.get(`/api/workspaces/${workspaceSlug}/properties/${propertyId}/`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async createAttribute(
    workspaceSlug: string,
    data: Partial<ICustomAttribute>
  ): Promise<ICustomAttribute> {
    return this.post(`/api/workspaces/${workspaceSlug}/properties/`, data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async patchAttribute(
    workspaceSlug: string,
    propertyId: string,
    data: Partial<ICustomAttribute>
  ): Promise<ICustomAttribute> {
    return this.patch(`/api/workspaces/${workspaceSlug}/properties/${propertyId}/`, data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async deleteAttribute(workspaceSlug: string, propertyId: string): Promise<any> {
    return this.delete(`/api/workspaces/${workspaceSlug}/properties/${propertyId}/`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async getAttributeValues(
    workspaceSlug: string,
    projectId: string,
    issueId: string
  ): Promise<{ children: ICustomAttributeValue[] }> {
    return this.get(
      `/api/workspaces/${workspaceSlug}/projects/${projectId}/issues/${issueId}/property-values/`
    )
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async createAttributeValues(
    workspaceSlug: string,
    projectId: string,
    issueId: string,
    data: ICustomAttributeValueFormData
  ): Promise<{ children: ICustomAttributeValue[] }> {
    return this.post(
      `/api/workspaces/${workspaceSlug}/projects/${projectId}/issues/${issueId}/property-values/`,
      data
    )
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async deleteAttributeValue(
    workspaceSlug: string,
    projectId: string,
    issueId: string,
    propertyId: string
  ): Promise<any> {
    return this.delete(
      `/api/workspaces/${workspaceSlug}/projects/${projectId}/issues/${issueId}/property-values/${propertyId}/`
    )
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }
}

const customAttributesService = new CustomAttributesService();

export default customAttributesService;
