import { IProjectListItem } from './IProjectListItem';
import { IContributorListItem } from './IContributorListItem';
import { IToDoListItem } from './IToDoListItem';  
  
export interface IToDoState {  
  status: string;  
  projectitems: IProjectListItem[];  
  contributoritems: IContributorListItem[];
  todoitems: IToDoListItem[];
  boarddata: any;
}