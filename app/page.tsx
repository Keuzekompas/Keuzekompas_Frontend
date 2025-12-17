const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-grow w-full">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form className="flex flex-col w-full max-w-sm">
        <label htmlFor="email" className="mb-2">Email</label>
        <input type="email" id="email" className="p-2 border rounded-lg mb-4" />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" className="p-2 border rounded-lg mb-4" />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded-lg">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;