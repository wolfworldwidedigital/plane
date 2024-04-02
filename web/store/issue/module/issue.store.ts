import concat from "lodash/concat";
import pull from "lodash/pull";
import uniq from "lodash/uniq";
import update from "lodash/update";
import { action, observable, makeObservable, computed, runInAction } from "mobx";
// base class
import { BaseIssuesStore, IBaseIssuesStore } from "../helpers/base-issues.store";
// services
import { ModuleService } from "@/services/module.service";
// types
import { TIssue, TLoader, ViewFlags, IssuePaginationOptions, TIssuesResponse } from "@plane/types";
import { IIssueRootStore } from "../root.store";
import { IModuleIssuesFilter } from "./filter.store";
import get from "lodash/get";

export interface IModuleIssues extends IBaseIssuesStore {
  viewFlags: ViewFlags;
  // actions
  fetchIssues: (
    workspaceSlug: string,
    projectId: string,
    loadType: TLoader,
    options: IssuePaginationOptions,
    moduleId: string
  ) => Promise<TIssuesResponse | undefined>;
  fetchIssuesWithExistingPagination: (
    workspaceSlug: string,
    projectId: string,
    loadType: TLoader,
    moduleId: string
  ) => Promise<TIssuesResponse | undefined>;
  fetchNextIssues: (
    workspaceSlug: string,
    projectId: string,
    moduleId: string,
    groupId?: string,
    subGroupId?: string
  ) => Promise<TIssuesResponse | undefined>;

  createIssue: (workspaceSlug: string, projectId: string, data: Partial<TIssue>, moduleId: string) => Promise<TIssue>;
  updateIssue: (workspaceSlug: string, projectId: string, issueId: string, data: Partial<TIssue>) => Promise<void>;
  archiveIssue: (workspaceSlug: string, projectId: string, issueId: string) => Promise<void>;
  quickAddIssue: (workspaceSlug: string, projectId: string, data: TIssue) => Promise<TIssue | undefined>;
  removeBulkIssues: (workspaceSlug: string, projectId: string, issueIds: string[]) => Promise<void>;
}

export class ModuleIssues extends BaseIssuesStore implements IModuleIssues {
  viewFlags = {
    enableQuickAdd: true,
    enableIssueCreation: true,
    enableInlineEditing: true,
  };
  // filter store
  issueFilterStore: IModuleIssuesFilter;

  constructor(_rootStore: IIssueRootStore, issueFilterStore: IModuleIssuesFilter) {
    super(_rootStore, issueFilterStore);

    makeObservable(this, {
      // action
      fetchIssues: action,
      fetchNextIssues: action,
      fetchIssuesWithExistingPagination: action,

      quickAddIssue: action,
    });
    // filter store
    this.issueFilterStore = issueFilterStore;
  }

  fetchIssues = async (
    workspaceSlug: string,
    projectId: string,
    loadType: TLoader,
    options: IssuePaginationOptions,
    moduleId: string
  ) => {
    try {
      runInAction(() => {
        this.loader = loadType;
      });
      this.clear();

      const params = this.issueFilterStore?.getFilterParams(options, undefined, undefined, undefined);
      const response = await this.moduleService.getModuleIssues(workspaceSlug, projectId, moduleId, params);

      this.onfetchIssues(response, options);
      return response;
    } catch (error) {
      this.loader = undefined;
      throw error;
    }
  };

  fetchNextIssues = async (
    workspaceSlug: string,
    projectId: string,
    moduleId: string,
    groupId?: string,
    subGroupId?: string
  ) => {
    const cursorObject = this.getPaginationData(groupId, subGroupId);
    if (!this.paginationOptions || (cursorObject && !cursorObject?.nextPageResults)) return;
    try {
      this.loader = "pagination";

      const params = this.issueFilterStore?.getFilterParams(
        this.paginationOptions,
        cursorObject?.nextCursor,
        groupId,
        subGroupId
      );
      const response = await this.moduleService.getModuleIssues(workspaceSlug, projectId, moduleId, params);

      this.onfetchNexIssues(response, groupId, subGroupId);
      return response;
    } catch (error) {
      this.loader = undefined;
      throw error;
    }
  };

  fetchIssuesWithExistingPagination = async (
    workspaceSlug: string,
    projectId: string,
    loadType: TLoader,
    moduleId: string
  ) => {
    if (!this.paginationOptions) return;
    return await this.fetchIssues(workspaceSlug, projectId, loadType, this.paginationOptions, moduleId);
  };

  override createIssue = async (workspaceSlug: string, projectId: string, data: Partial<TIssue>, moduleId: string) => {
    try {
      const response = await super.createIssue(workspaceSlug, projectId, data, moduleId);
      await this.addIssuesToModule(workspaceSlug, projectId, moduleId, [response.id], false);

      this.rootIssueStore.rootStore.module.fetchModuleDetails(workspaceSlug, projectId, moduleId);

      return response;
    } catch (error) {
      throw error;
    }
  };

  quickAddIssue = this.issueQuickAdd;
}
