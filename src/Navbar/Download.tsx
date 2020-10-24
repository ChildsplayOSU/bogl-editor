import * as React from 'react';
import { Icon } from 'react-icons-kit'
import {download} from 'react-icons-kit/fa/download'

interface DownloadProps {
  content : string,
  link : string
}

class Download extends React.Component<DownloadProps> {

  render() {
    console.info("Content: " + this.props.content);
    console.info("Link: " + this.props.link);
    let data = new Blob([this.props.content], {type: 'text/plain'});
    let url = window.URL.createObjectURL(data);

    // copy on loading in
    return (<>
      <a className="downloadLink" href={url} download={this.props.link} title={"Download " + this.props.link}><Icon icon={download}/></a>
    </>);

  }

}

export default Download;
