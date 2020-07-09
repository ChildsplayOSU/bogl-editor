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

    return (<>
      <Form.Control id="preludeShare" ref={this.preludeShareRef} type="url" value={baseURL + "?p=" + this.props.shareLink + "&s=0"}/>
      <Form.Control id="preludeShare" className="hidden" ref={this.codeShareRef} type="url" value={baseURL + "?p=" + this.props.shareLink + "&s=1"}/>
      <Form.Control id="preludeShare" className="hidden" ref={this.bothShareRef} type="url" value={baseURL + "?p=" + this.props.shareLink + "&s=2"}/>

      <Form.Control id="shareLinkButton" type="button" onClick={() => this.copyToClipboard(this.preludeShareRef)} value="P" title="Share Prelude Only"/>
      <Form.Control id="shareLinkButton" type="button" onClick={() => this.copyToClipboard(this.codeShareRef)} value="C" title="Share Code Only"/>
      <Form.Control id="shareLinkButton" type="button" onClick={() => this.copyToClipboard(this.bothShareRef)} value="P & C" title="Share Both"/>
    </>);
  }

}

export default Share;
