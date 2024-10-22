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
        <p className="mx-auto mt-0.5 max-w-[280px] text-xs xl:mt-4 xl:max-w-none xl:text-sm">
          Introduction lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor
          sit amet, consectetu elit.
        </p>
      )}
    </div>
  );
};

export default Intro;
