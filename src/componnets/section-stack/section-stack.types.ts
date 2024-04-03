export type Root = IContent[];

export type IContent =
  | ISocialLinks
  | IImageScreen
  | IMainSection
  | ITextStack
  | IDataGrid
  | IDataList
  | IImageCard;

export interface ISocialLinks {
  contentType: "SocialLinks";
  position: Position;
  link: string;
  externalLink: ExternalLink;
}

export interface IImageScreen {
  contentType: "ImageScreen";
  title: string;
  position: Position;
  src: string;
  metaData: string;
  link: string;
  externalLink?: string;
}
export interface IImageCard {
  contentType: "ImageCard";
  title: string;
  position: Position;
  src: string;
  metaData: string;
  link: string;
  externalLink?: string;
}

export interface IMainSection {
  contentType: string;
  title: string;
  position: Position;
  isZoneCenter: boolean;
  link: string;
}
export interface ITextStack {
  contentType: "TextStack";
  title: string;
  position: Position;
  content: string[][];
  isZoneCenter?: boolean;
  link: string;
}

export interface IDataGrid {
  contentType: string;
  title: string;
  position: Position;
  content: Content[];
  isZoneCenter?: boolean;
  link: string;
}

export interface IDataList {
  contentType: string;
  title: string;
  position: Position;
  link: string;
  content: ListContent[];
}

export interface Position {
  x: number;
  y: number;
}

export interface ExternalLink {
  github: string;
  linkedIn: string;
  devTo: string;
}

export interface Content {
  title: string;
  src: string;
  link: string;
}
export interface ListContent {
  name: string;
  tag: string;
  date: string;
}
