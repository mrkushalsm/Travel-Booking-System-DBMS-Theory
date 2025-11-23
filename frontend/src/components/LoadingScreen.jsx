const LoadingScreen = ({ message = 'Loading data...' }) => (
  <div className="flex min-h-[40vh] items-center justify-center">
    <span className="loading loading-spinner loading-lg text-primary" aria-label={message} />
  </div>
);

export default LoadingScreen;
