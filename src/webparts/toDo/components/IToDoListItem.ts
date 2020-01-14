import { IProjectListItem } from './IProjectListItem';
import { IContributorListItem } from './IContributorListItem';
export interface IToDoListItem {  
    Title?: string;  
    Comments?: string;  
    Id: number; 
    Project: IProjectListItem;
    Contributor: IContributorListItem; 
    Status?: string;
} 