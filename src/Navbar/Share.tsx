import * as React from 'react';
import Form from 'react-bootstrap/Form';

interface ShareProps {
  shareLink: string
}

class Share extends React.Component<ShareProps> {


  // share references
  // prelude share ref
  preludeShareRef : any = React.createRef();
  // code share ref
  codeShareRef : any = React.createRef();
  // code & prelude share ref
  bothShareRef : any = React.createRef();


  //
  // Allows Copy to Clipboard Behavior
  // Pulled & Based on the W3C's example @ https://www.w3schools.com/howto/howto_js_copy_clipboard.asp
  //
  copyToClipboard(ref) {
    ref.current.select();
    // Copy the text inside the text field
    document.execCommand("copy");
    alert("Copied to Clipboard!");
  }


  render() {

    // trim off the ?... end part of the URL
    const baseURL = window.location.href.replace(/\?p=.*$/,'');

    // copy on loading in
    return (<>
      <Form.Control id="shareLinkButton" type="button" className="right-padd" onClick={() => this.copyToClipboard(this.bothShareRef)} value="Copy" title="Copy the share link"/>
      <Form.Control id="preludeShare" className="right-padd" ref={this.bothShareRef} type="url" readOnly value={baseURL + "?p=" + this.props.shareLink + "&s=2"}/>
    </>);
  }

}

export default Share;
