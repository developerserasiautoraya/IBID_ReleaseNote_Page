export interface ConfluencePage {
  id: string;
  status: string;
  title: string;
  spaceId: string;
  childPosition: number;
  children?: ConfluencePage[];
  body: {
    styled_view: {
      value: string;
    };
  };
}

export interface ConfluenceApiError {
  statusCode: number;
  message: string;
  reason: string;
  data?: any;
}

export interface GetConfluenceChild {
  id: string;
  status: string;
  title: string;
  spaceId: string;
  childPosition: number;
  children?: GetConfluenceChild[];
}

export interface GetConfluencePageById {
  parentId: string;
  spaceId: string;
  ownerId: string;
  sourceTemplateEntityId: string;
  lastOwnerId: string | null;
  createdAt: string;
  authorId: string;
  parentType: string;
  position: number;
  version: {
    number: number;
    message: string;
    minorEdit: boolean;
    authorId: string;
    createdAt: string;
    ncsStepVersion: string;
  }
  body: {
    atlas_doc_format: {
      representation: string;
      value: string;
    }
  }
  status: string;
  title: string;
  id: string;
  _links: {
    editui: string;
    webui: string;
    edituiv2: string;
    tinyui: string;
    base: string;
  }
}
