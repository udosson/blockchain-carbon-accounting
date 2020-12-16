import React, { useState, useEffect } from "react";

import { getTokenDetails } from "../services/contract-functions";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

export default function TokenInfoModal(props) {

  const [tokenDetails, setTokenDetails] = useState({});
  const [fetchingTokenDetails, setFetchingTokenDetails] = useState(false);

  async function fetchTokenDetails() {
    // Fetch raw token details
    let details_raw = await getTokenDetails(props.provider, props.token);

    // Format token type ID
    let tokenType;
    switch (details_raw.tokenTypeId) {
      case 1:
        tokenType = "Renewable Energy Certificate";
        break;
      case 2:
        tokenType = "Carbon Emissions Offset";
        break;
      case 3:
        tokenType = "Audited Emissions";
        break;
    }

    // Format unix times to Date objects
    let fromDateObj = new Date((details_raw.fromDate.toNumber()) * 1000);
    let thruDateObj = new Date((details_raw.thruDate.toNumber()) * 1000);
    let automaticRetireDateObj = new Date((details_raw.automaticRetireDate.toNumber()) * 1000);

    let details = {
      tokenId: details_raw.tokenId,
      issuer: details_raw.issuer,
      issuee: details_raw.issuee,
      tokenTypeId: tokenType,
      uom: details_raw.uom,
      fromDate: fromDateObj.toLocaleString(),
      thruDate: thruDateObj.toLocaleString(),
      automaticRetireDate: automaticRetireDateObj.toLocaleString(),
      metadata: details_raw.metadata,
      manifest: details_raw.manifest,
      description: details_raw.description,
    }
    details.tokenId = details.tokenId.toNumber();
    setTokenDetails(details);
    setFetchingTokenDetails(false);
  }

  useEffect(() => {
    if (props.token && tokenDetails !== "") {
      setFetchingTokenDetails(true);
      fetchTokenDetails();
    }
  }, [props.token]);

  return (
    <Modal
      {...props}
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Token Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          {tokenDetails === ""
          ? <>
              <div className="text-center mt-3">
                <Spinner animation="border" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              </div>
            </>
          : <>
              <table className="table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>ID</td>
                    <td>{(tokenDetails.tokenId)}</td>
                  </tr>
                  <tr>
                    <td>Issuer</td>
                    <td>{tokenDetails.issuer}</td>
                  </tr>
                  <tr>
                    <td>Issuee</td>
                    <td>{tokenDetails.issuee}</td>
                  </tr>
                  <tr>
                    <td>Token type</td>
                    <td>{tokenDetails.tokenTypeId}</td>
                  </tr>
                  <tr>
                    <td>UOM</td>
                    <td>{tokenDetails.uom}</td>
                  </tr>
                  <tr>
                    <td>From date</td>
                    <td>{tokenDetails.fromDate}</td>
                  </tr>
                  <tr>
                    <td>Through date</td>
                    <td>{tokenDetails.thruDate}</td>
                  </tr>
                  <tr>
                    <td>Automatic retire date</td>
                    <td>{tokenDetails.automaticRetireDate}</td>
                  </tr>
                  <tr>
                    <td>Metadata</td>
                    <td>{tokenDetails.metadata}</td>
                  </tr>
                  <tr>
                    <td>Manifest</td>
                    <td>{tokenDetails.manifest}</td>
                  </tr>
                  <tr>
                    <td>Description</td>
                    <td>{tokenDetails.description}</td>
                  </tr>
                </tbody>
              </table>
            </>
          }
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
