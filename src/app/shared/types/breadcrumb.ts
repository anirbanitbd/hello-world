export interface Breadcrumb{
  type?: string;
  links?: Array<{
    name: string | null
    isLink: boolean;
    link?: string | null;
  }>;
}
