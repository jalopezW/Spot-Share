// Navbar Component
export function Navbar() {
  return (
    <nav className="flex items-center justify-between gap-4 p-4 bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="text-2xl font-bold text-blue-600">Spot Share</div>

      <div className="flex-1 max-w-xl mx-4">
        <label htmlFor="search" className="sr-only">
          Search parking spots
        </label>
        <input
          id="search"
          type="search"
          placeholder="Search for parking spots..."
          className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          aria-label="Search parking spots"
        />
      </div>

      <div className="flex items-center gap-3">
        <button className="px-4 py-2 text-blue-600 font-semibold rounded-md hover:bg-blue-50 transition">
          Login
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">
          Sign Up
        </button>
      </div>
    </nav>
  );
}
