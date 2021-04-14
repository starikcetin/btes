import _ from 'lodash';
import React, { useEffect, useMemo, useRef } from 'react';
import { NavLink, Redirect, useLocation, useParams } from 'react-router-dom';
import { Row, Col, Nav, Container } from 'react-bootstrap';

import './Help.scss';
import { getAllDocIds, getDoc } from '../../docs/docsService';
import { hasValue } from '../../common/utils/hasValue';
import { Markdown } from '../../components/Markdown/Markdown';

interface HelpParamTypes {
  id: string;
}

export const Help: React.FC = () => {
  const { id } = useParams<HelpParamTypes>();
  const activeDocManifest = useMemo(() => getDoc(id), [id]);
  const allDocIds = getAllDocIds();
  const location = useLocation();

  const mdRoot = useRef<HTMLDivElement>(null);
  const mdContent =
    mdRoot.current?.getElementsByClassName('gen-markdown--content')[0] ?? null;

  // scroll to anchor tag when it changes
  useEffect(() => {
    const element = document.getElementById(location.hash.replace('#', ''));
    mdContent?.scrollTo({
      behavior: 'smooth',
      top: element ? element.offsetTop : 0,
    });
  }, [location.hash, mdContent]);

  // scroll to top when doc id changes
  useEffect(() => {
    mdContent?.scrollTo(0, 0);
  }, [id, mdContent]);

  if (!hasValue(id) || _.isEmpty(id)) {
    return <Redirect to="/help/home" />;
  }

  return (
    <div className="page-help h-100">
      <Container fluid={true} className="h-100">
        <Row className="h-100">
          <Col xs="auto" className="mh-100 overflow-auto border-right p-3">
            <Nav variant="pills" className="flex-column">
              {allDocIds.map((docId) => (
                <Nav.Link
                  as={NavLink}
                  to={`/help/${docId}`}
                  className="nav-link"
                  activeClassName="active"
                  exact={true}
                >
                  {getDoc(docId)?.title ??
                    `(Error: Cannot retreive title of doc with id '${docId}'!)`}
                </Nav.Link>
              ))}
            </Nav>
          </Col>
          <Col
            className="page-help--markdown overflow-hidden mh-100"
            ref={mdRoot}
          >
            {hasValue(activeDocManifest) ? (
              <Markdown html={activeDocManifest.content} />
            ) : (
              <div>
                <h1>Sorry</h1>
                <p>
                  No documentation found with ID <code>{id}</code>.
                </p>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};
