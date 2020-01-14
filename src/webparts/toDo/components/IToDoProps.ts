import { SPHttpClient } from '@microsoft/sp-http';
export interface IToDoProps {
  header: string;
  spHttpClient: SPHttpClient;  
  siteUrl: string; 
}