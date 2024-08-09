import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Aggregated Balance',
    Svg: require('@site/static/img/balance.svg').default,
    description: (
      <>
        Single token balance representing one asset across multiple chains.
      </>
    ),
  },
  {
    title: 'Optimized Execution',
    Svg: require('@site/static/img/execution.svg').default,
    description: (
      <>
        Automatically determines the fastest and cheapest execution paths for a transfer, regardless of layer.
      </>
    ),
  },
  {
    title: 'UX Buff',
    Svg: require('@site/static/img/ux.svg').default,
    description: (
      <>
        One signature to nuke network switching once and for all.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
