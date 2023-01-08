declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

declare module "*.png";
declare module "*.jpeg";
declare module "*.jpg";
declare module "*.svg";

declare function createWebviewElement(): HTMLIFrameElement;
