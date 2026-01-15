import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import './About.css';

function About() {
  const { t } = useTranslation();

  return (
    <div className="about-page">
      {/* About Hero Section */}
      <section className="about-hero">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="about-title">{t('aboutEmbroideryStudio')}</h1>
              <p className="about-lead">
                {t('craftingExcellence')}
              </p>
            </Col>
            <Col lg={6}>
              <div className="about-hero-image">
                <img 
                  src="https://images.unsplash.com/photo-1558769132-cb1aea1c8e5d?w=600" 
                  alt="Embroidery Machine" 
                  className="img-fluid rounded-lg"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto">
              <div className="story-content">
                <h2 className="section-title">{t('ourStory')}</h2>
                <p className="story-text">
                  {t('ourStoryText')}
                </p>
                <p className="story-text">
                  {t('ourJourney')}
                </p>
                <p className="story-text">
                  {t('ourCustomers')}
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <Container>
          <h2 className="section-title text-center mb-5">{t('ourCoreValues')}</h2>
          <Row className="g-4">
            <Col md={6} lg={3}>
              <Card className="value-card">
                <Card.Body className="text-center">
                  <div className="value-icon">
                    <i className="fas fa-award"></i>
                  </div>
                  <h4 className="value-title">{t('qualityFirst')}</h4>
                  <p className="value-text">
                    {t('qualityFirstDesc')}
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="value-card">
                <Card.Body className="text-center">
                  <div className="value-icon">
                    <i className="fas fa-lightbulb"></i>
                  </div>
                  <h4 className="value-title">{t('innovation')}</h4>
                  <p className="value-text">
                    {t('innovationDesc')}
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="value-card">
                <Card.Body className="text-center">
                  <div className="value-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <h4 className="value-title">{t('customerFocus')}</h4>
                  <p className="value-text">
                    {t('customerFocusDesc')}
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="value-card">
                <Card.Body className="text-center">
                  <div className="value-icon">
                    <i className="fas fa-leaf"></i>
                  </div>
                  <h4 className="value-title">{t('sustainability')}</h4>
                  <p className="value-text">
                    {t('sustainabilityDesc')}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <Container>
          <h2 className="section-title text-center mb-5">{t('meetOurTeam')}</h2>
          <Row className="g-4">
            <Col md={6} lg={4}>
              <Card className="team-card">
                <div className="team-image-wrapper">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400" 
                    alt="Team Member" 
                    className="team-image"
                  />
                </div>
                <Card.Body className="text-center">
                  <h5 className="team-name">{t('sarahJohnson')}</h5>
                  <p className="team-role">{t('founderCEO')}</p>
                  <p className="team-bio">
                    {t('sarahBio')}
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="team-card">
                <div className="team-image-wrapper">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" 
                    alt="Team Member" 
                    className="team-image"
                  />
                </div>
                <Card.Body className="text-center">
                  <h5 className="team-name">Michael Chen</h5>
                  <p className="team-role">Head Designer</p>
                  <p className="team-bio">
                    Award-winning designer specializing in contemporary embroidery patterns.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="team-card">
                <div className="team-image-wrapper">
                  <img 
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400" 
                    alt="Team Member" 
                    className="team-image"
                  />
                </div>
                <Card.Body className="text-center">
                  <h5 className="team-name">Emily Rodriguez</h5>
                  <p className="team-role">Production Manager</p>
                  <p className="team-bio">
                    Ensures every piece meets our exacting quality standards.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <Container>
          <Row className="text-center">
            <Col md={3} sm={6} className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Happy Customers</div>
            </Col>
            <Col md={3} sm={6} className="stat-item">
              <div className="stat-number">200+</div>
              <div className="stat-label">Unique Designs</div>
            </Col>
            <Col md={3} sm={6} className="stat-item">
              <div className="stat-number">15+</div>
              <div className="stat-label">Years Experience</div>
            </Col>
            <Col md={3} sm={6} className="stat-item">
              <div className="stat-number">99%</div>
              <div className="stat-label">Satisfaction Rate</div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default About;
