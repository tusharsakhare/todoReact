import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'ToDoWebPartStrings';
import ToDo from './components/ToDo';
import { IToDoProps } from './components/IToDoProps';

export interface IToDoWebPartProps {
  header: string;
}

export default class ToDoWebPart extends BaseClientSideWebPart<IToDoWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IToDoProps > = React.createElement(
      ToDo,
      {
        header: this.properties.header,
        spHttpClient: this.context.spHttpClient,  
        siteUrl: this.context.pageContext.web.absoluteUrl 
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('header', {
                  label: strings.HeaderFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
