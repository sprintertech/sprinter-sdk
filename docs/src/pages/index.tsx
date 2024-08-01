import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className={clsx('hero__title', styles.heroTitle)}>
          {siteConfig.title}
        </Heading>
        <p className={clsx('hero__subtitle', styles.heroSubtitle)}>
          <span className={styles.highlight}>Multichain</span> interactions that <span className={styles.highlight}>feel </span> like <span className={styles.highlight}>one</span>
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Get Started
          </Link>
        </div>
        <br />
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="https://poc.sprinter.buildwithsygma.com/">
            Try the Proof of Concept
          </Link>
        </div>
      </div>
    </header>
  );
}

function CallToActionSection() {
  return (
    <section className={styles.callToActionSection}>
      <div className="container">
        <div className="row">
          <div className="col col--6">
          <h2>
              <span className={styles.highlight}>Sprint</span> Into Action
            </h2>
            <p>Evolve your application's UX. Reach out to the Sprinter team to integrate today.</p>
            <Link
              className="button button--primary button--lg"
              to="mailto:requests@buildwithsygma.com">
              Contact Us
            </Link>
          </div>
          <div className="col col--6">
            <img src="/img/intersect.svg" alt="ContactUs" className={styles.ctaImage} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <CallToActionSection />
      </main>
    </Layout>
  );
}
