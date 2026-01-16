import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import './About.css';

function About() {
  const { t, i18n } = useTranslation();
  const [heroImage, setHeroImage] = useState('https://images.unsplash.com/photo-1558769132-cb1aea1c8e5d?w=600');
  const [teamMembers, setTeamMembers] = useState([]);

  const getImageSrc = (imgData) => {
    if (imgData?.imageData && imgData?.contentType) {
      return `data:${imgData.contentType};base64,${imgData.imageData}`;
    }
    return '';
  };

  useEffect(() => {
    const fetchImages = async () => {
      // Fetch hero
      try {
        const res = await api.get('/images/location/about-hero');
        const img = res.data?.data;
        if (img?.imageData && img?.contentType) {
          setHeroImage(`data:${img.contentType};base64,${img.imageData}`);
        }
      } catch (err) {
        // Leave default image
      }

      // Fetch team members
      try {
        const res = await api.get('/team');
        setTeamMembers(res.data?.data || []);
      } catch (err) {
        console.error('Failed to load team members');
      }
    };
    fetchImages();
  }, []);

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
                  src={heroImage} 
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
          {teamMembers.length > 0 ? (
            <Row className="g-4">
              {teamMembers.map((member) => (
                <Col md={6} lg={4} key={member._id}>
                  <Card className="team-card">
                    <div className="team-image-wrapper">
                      <img 
                        src={member.imageData && member.contentType 
                          ? `data:${member.contentType};base64,${member.imageData}`
                          : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
                        }
                        alt={member.name} 
                        className="team-image"
                      />
                    </div>
                    <Card.Body className="text-center">
                      <h5 className="team-name">{member.name}</h5>
                      <p className="team-role">{member.role[i18n.language] || member.role.en}</p>
                      <p className="team-bio">
                        {member.bio[i18n.language] || member.bio.en}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center">
              <p className="text-muted">No team members to display yet.</p>
            </div>
          )}
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
