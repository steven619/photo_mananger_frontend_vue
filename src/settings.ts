interface ISettings {
  title: string // Overrides the default title
  showSettings: boolean // Controls settings panel display
  showTagsView: boolean // Controls tagsview display
  showSidebarLogo: boolean // Controls siderbar logo display
  sideBarTitle: string,
  devUrl: string,
  fixedHeader: boolean // If true, will fix the header component
  errorLog: string[] // The env to enable the errorlog component, default 'production' only
  sidebarTextTheme: boolean // If true, will change active text color for sidebar based on theme
  devServerPort: number // Port number for webpack-dev-server
  mockServerPort: number // Port number for mock server
  projectStatus: string
  projectQuery: object
}
const title:string = '图片点评管理系统'
export const homeUrl:string = '/'
export const imgBaseUrl:string = ''
// You can customize below settings :)
const settings: ISettings = {
  // devUrl: 'http://192.168.9.33:33365/api/v1',
  devUrl: '',
  title: title,
  showSettings: true,
  showTagsView: true,
  fixedHeader: true,
  showSidebarLogo: true,
  sideBarTitle: title,
  errorLog: ['production'],
  sidebarTextTheme: true,
  devServerPort: 9527,
  mockServerPort: 9528,
  projectStatus: 'company',
  projectQuery: {}
}

export default settings
