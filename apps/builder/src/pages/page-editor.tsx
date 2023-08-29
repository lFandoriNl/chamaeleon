const Sidebar = () => {
  return (
    <div className="bg-gray-800 text-white h-screen w-1/5 p-4">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">My Sidebar</h1>
      </div>
      <nav>
        <ul className="space-y-2">
          <li>
            <a href="#" className="block hover:text-blue-500">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="block hover:text-blue-500">
              About
            </a>
          </li>
          <li>
            <a href="#" className="block hover:text-blue-500">
              Services
            </a>
          </li>
          <li>
            <a href="#" className="block hover:text-blue-500">
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

const Content = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-semibold mb-4">Main Content</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget
        lectus eu libero efficitur dignissim.
      </p>
    </div>
  );
};

export const PageEditor = () => {
  return (
    <div className="flex">
      <Sidebar />
      <Content />
    </div>
  );
};
