import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './AboutUs.scss';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

const AboutUs: React.FC = () => {
  return (
    <div>
      <div className="bg-light">
        <div className="container py-5">
          <div className="row h-100 align-items-center py-5">
            <div className="col-lg-6">
              <h1 className="display-4">About Us</h1>
              <p className="lead text-muted">
                Our aim is making a educational web-based platform about
                blockchain technology, catering towards absolutely everyone.
              </p>
              <p className="lead text-muted">
                <a
                  href="http://www.ctis.bilkent.edu.tr/ctis_seniorProject.php?semester=27&id=4968"
                  className="text-muted"
                >
                  <u>Bilkent CTIS - Senior Project</u>
                </a>
              </p>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
              <img
                src="https://res.cloudinary.com/mhmd/image/upload/v1556834136/illus_kftyh4.png"
                alt=""
                className="img-fluid"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-5">
        <div className="container py-5">
          <div className="row align-items-center mb-5">
            <div className="col-lg-6 order-2 order-lg-1">
              <i className="fa fa-bar-chart fa-2x mb-3 text-primary"></i>
              <h2 className="font-weight-light mb-4">Contact Us </h2>
              <p className="font text-muted mb-4">
                <FontAwesomeIcon icon={faGithub} /> GitHub repository:{' '}
                <a href="https://github.com/ctisbtes/btes" className="link">
                  ctisbtes/btes
                </a>
              </p>
            </div>
            <div className="col-lg-5 px-5 mx-auto order-1 order-lg-2">
              <img
                src="https://res.cloudinary.com/mhmd/image/upload/v1556834139/img-1_e25nvh.jpg"
                alt=""
                className="img-fluid mb-4 mb-lg-0"
              />
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-lg-5 px-5 mx-auto">
              <img
                src="https://st4.depositphotos.com/8956546/27303/v/450/depositphotos_273035242-stock-illustration-blockchain-modern-flat-design-isometric.jpg%20?%3E"
                alt=""
                className="img-fluid mb-4 mb-lg-0"
              />
            </div>
            <div className="col-lg-6">
              <i className="fa fa-leaf fa-2x mb-3 text-primary"></i>
              <h2 className="font-weight-light mb-4">
                How can we help you? Having trouble understanding blockchain?
                Are you looking for an environment explain blockchain
                collectively?
              </h2>
              <p className="text-muted mb-4">
                Simulation, documentation, and teaching tools all meet
                interactively at BTES. Providing a colloborative and interactive
                platform with the aim of making it simplier and easier for
                everyone to learn the blockchain technology.
              </p>
              <li className="text-muted mb3">
                Real bitcoin protocol running in a simulated environment.
              </li>
              <li className="text-muted mb3">Interaction-first design.</li>
              <li className="text-muted mb3">
                Two different simulation types: Lesson-based simulations for
                step by step learning, and sandbox simulatons that give you
                total freedom.
              </li>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-light py-5">
        <div className="container py-5">
          <div className="row mb-4">
            <div className="col-lg-5">
              <h2 className="display-4 font-weight-light">Our Team</h2>
              <p className="text-muted">We are ready to help</p>
            </div>
          </div>

          <div className="row text-center">
            <div className="col-xl-3 col-sm-6 mb-5">
              <div className="bg-white rounded shadow-sm py-5 px-4">
                <img
                  src="https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png"
                  alt=""
                  width="100"
                  className="img-fluid rounded-circle mb-3 img-thumbnail shadow-sm"
                />
                <h5>Beste Kulözü</h5>
                <p className="small text-uppercase text-muted">Co - Founder</p>
                <p>
                  <a href="mailto:bkklz@outlook.com">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </a>
                  <a href="https://github.com/bkkulozu" className="ml-3">
                    <FontAwesomeIcon icon={faGithub} />
                  </a>
                </p>
              </div>
            </div>

            <div className="col-xl-3 col-sm-6 mb-5">
              <div className="bg-white rounded shadow-sm py-5 px-4">
                <img
                  src="https://img.freepik.com/free-vector/man-avatar-profile-on-round-icon_24640-14044.jpg?size=338&ext=jpg"
                  alt=""
                  width="100"
                  className="img-fluid rounded-circle mb-3 img-thumbnail shadow-sm"
                />
                <h5>Şükrü Kırman</h5>
                <p className="small text-uppercase text-muted">Co - Founder</p>
                <p>
                  <a href="mailto:sukru.kirman@ug.bilkent.edu.tr">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </a>
                  <a href="https://github.com/sukrukirman" className="ml-3">
                    <FontAwesomeIcon icon={faGithub} />
                  </a>
                </p>
              </div>
            </div>

            <div className="col-xl-3 col-sm-6 mb-5">
              <div className="bg-white rounded shadow-sm py-5 px-4">
                <img
                  src="https://img.freepik.com/free-vector/man-avatar-profile-on-round-icon_24640-14044.jpg?size=338&ext=jpg"
                  alt=""
                  width="100"
                  className="img-fluid rounded-circle mb-3 img-thumbnail shadow-sm"
                />
                <h5>S. Tarık Çetin</h5>
                <p className="small text-uppercase text-muted">Co - Founder</p>
                <p>
                  <a href="mailto:cetinsamedtarik@gmail.com">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </a>
                  <a href="https://github.com/starikcetin" className="ml-3">
                    <FontAwesomeIcon icon={faGithub} />
                  </a>
                </p>
              </div>
            </div>

            <div className="col-xl-3 col-sm-6 mb-5">
              <div className="bg-white rounded shadow-sm py-5 px-4">
                <img
                  src="https://img.freepik.com/free-vector/man-avatar-profile-on-round-icon_24640-14044.jpg?size=338&ext=jpg"
                  alt=""
                  width="100"
                  className="img-fluid rounded-circle mb-3 img-thumbnail shadow-sm"
                />
                <h5>Elnur Alizada</h5>
                <p className="small text-uppercase text-muted">Co - Founder</p>
                <p>
                  <a href="mailto:elnur.alizada@ug.bilkent.edu.tr">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </a>
                  <a href="https://github.com/elnurali0" className="ml-3">
                    <FontAwesomeIcon icon={faGithub} />
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
