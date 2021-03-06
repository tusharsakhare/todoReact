import * as React from 'react';
import styles from './ToDo.module.scss';
import { IToDoProps } from './IToDoProps';
import { IToDoState } from './IToDoState';
import { IToDoListItem } from './IToDoListItem';
import { escape } from '@microsoft/sp-lodash-subset';
import Board from 'react-trello'
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';


export default class ToDo extends React.Component<IToDoProps, IToDoState, {}> {

  constructor(props: IToDoProps, state: IToDoState) {
    super(props);
    this.readItem();

    this.state = {
      status: "Ready",
      projectitems: [],
      contributoritems: [],
      todoitems: [],
      boarddata: {
        lanes: [],
      }
    };
  }

  public render(): React.ReactElement<IToDoProps> {
    return (
      <div className={styles.toDo}>
        <h2 className={styles.header}>{this.props.header}</h2>
        <h3>{this.state.status}</h3>
        <Board data={this.state.boarddata}
          className={styles.boardContainer}
          onCardMoveAcrossLanes={this.onCardMoveAcrossLanes} />
      </div>
    );
  }

  private onCardMoveAcrossLanes(fromProjectId, toProjectId, toDoId, addedIndex) {
    debugger;
    console.log('onCardMoveAcrossLanes: ${fromProjectId}, ${toProjectId}, ${toDoId}, ${addedIndex}');
  }

  private convertTodoIntoBoardData() {
    var tempBoardData = {
      lanes: [],
    };

    const tempLanes = this.state.todoitems.map(q => q.Project);
    var tempLanesUnique = [];
    var tempLanesUniqueObjArr=[];

    tempLanes.map(lane => {
      if (tempLanesUnique.indexOf(lane.Title) === -1) {
        tempLanesUnique.push(lane.Title)
        tempLanesUniqueObjArr.push({Title:lane.Title, Id:lane.Id});
      }
    });
    debugger;
    for (var i = 0; i < tempLanesUnique.length; i++) {
      var tempContributors = this.state.todoitems.filter(item => item.Project.Title === tempLanesUnique[i]);
      var tempcards = [];
      for (var j = 0; j < tempContributors.length; j++) {
        var tempCard = {
          id: tempContributors[j].Id,
          title: tempContributors[j].Contributor.Title,
          description: tempContributors[j].Title,
          label: tempContributors[j].Status,
          draggable: true
        };
        tempcards.push(tempCard)
      }


      var tempBoard = {
        id: tempLanesUniqueObjArr[i].Id,
        title: tempLanesUniqueObjArr[i].Title,
        label: tempcards.length + '/' + tempcards.length,
        cards: tempcards
      };

      //push to array of board data
      tempBoardData.lanes.push(tempBoard);
    }


    this.setState({
      status: `Board Data Lanes Count: ${tempBoardData.lanes.length}`,
      boarddata: tempBoardData
    });

  }



  private readItem(): void {
    this.setState({
      status: 'Loading latest items...'
    });

    this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('ToDo')/items?$select=Title,Id,Status,Project/Title,Project/Id,Contributor/Title,Contributor/Id&$expand=Project,Contributor`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          'Accept': 'application/json;odata=nometadata',
          'odata-version': ''
        }
      })
      .then((response: SPHttpClientResponse): Promise<any> => {
        return response.json();
      })
      .then((items: any): void => {
        var todolistitems = items.value as IToDoListItem[];
        this.setState({
          status: `Items Count: ${todolistitems.length}`,
          todoitems: todolistitems
        });
        this.convertTodoIntoBoardData();
      }, (error: any): void => {
        this.setState({
          status: 'Loading latest items failed with error: ' + error,
          todoitems: []
        });
      });
  };

}
