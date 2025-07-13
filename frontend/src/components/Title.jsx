const Title = ({ title1, title2 }) => {
  return (
    <div className="flex items-center gap-2 justify-center poppins">
      <p className="w-12 lg:w-20 h-[2px] bg-[var(--secondary)]"></p>
      <p className="mx-4 text-sm font-bold py-6 text-white ">
        <span className="bg-[var(--secondary)] p-1 rounded-full px-6 tracking-wide">
          {title1}
        </span>

        <span className="text-[var(--secondary)] pl-2 p-1 tracking-wide">
          {title2}
        </span>
      </p>

      <p className="w-12 lg:w-20 h-[2px] bg-[var(--primary)]"></p>
    </div>
  );
};

export default Title;
