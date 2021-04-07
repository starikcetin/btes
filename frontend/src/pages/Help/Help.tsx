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
  const contentScrollRoot = useRef<HTMLDivElement>(null);
  const allDocIds = getAllDocIds();
  const location = useLocation();

  // scroll to anchor tag when it changes
  useEffect(() => {
    const element = document.getElementById(location.hash.replace('#', ''));
    contentScrollRoot.current?.scrollTo({
      behavior: 'smooth',
      top: element ? element.offsetTop : 0,
    });
  }, [location.hash]);

  // scroll to top when doc id changes
  useEffect(() => {
    contentScrollRoot.current?.scrollTo(0, 0);
  }, [id]);

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
            className="page-help--markdown mh-100 overflow-auto p-4"
            ref={contentScrollRoot}
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
