export interface IntroProps {
  showDescription?: boolean;
}

const Intro = ({ showDescription = true }: IntroProps) => {
  return (
    <div className="text-center xl:text-left">
      <h1 className="font-serif text-4xl text-supernova-yellow-400 xl:text-[46px] xl:leading-[63px]">
        South Sudan
      </h1>
      {showDescription && (
        <p className="mx-auto mt-0.5 max-w-[280px] text-xs leading-6 xl:mt-4 xl:max-w-none xl:text-sm xl:leading-[26px]">
          Explore South Sudan’s geospatial visualization tool, a centralized platform for accessing
          and analyzing hydrological data. Discover insights on flood, drought, and
          hydrometeorological patterns to support effective water resource management.
        </p>
      )}
    </div>
  );
};

export default Intro;
