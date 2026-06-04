import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-blue-50 text-slate-900 selection:bg-blue-200">
      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-blue-950">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-6 w-6"
              fill="none"
            >
              <path
                d="M4 12h6.5c2.5 0 4.5-2 4.5-4.5V5"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 12h6.5c2.5 0 4.5 2 4.5 4.5V19"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.5 5h2.8c1.5 0 2.7 1.2 2.7 2.7v2.8"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.5 19h2.8c1.5 0 2.7-1.2 2.7-2.7v-2.8"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          Cleave
        </div>
        <nav className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-semibold text-slate-600 transition-colors hover:text-blue-600"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] hover:bg-blue-700 active:scale-[0.98]"
          >
            Sign up
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">

          {/* Text Content */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="mb-4 inline-flex items-center rounded-full border border-blue-200 bg-blue-100/50 px-3 py-1 text-xs font-semibold text-blue-800">
              <span className="mr-2 flex h-2 w-2 rounded-full bg-blue-600"></span>
              The smarter way to share expenses
            </div>
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-blue-950 sm:text-6xl lg:text-7xl">
              Split expenses, <br className="hidden lg:block" />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                not friendships.
              </span>
            </h1>
            <p className="mb-8 max-w-xl text-lg text-slate-500 sm:text-xl">
              Keep track of your shared expenses, balances, and who owes who. Cleave makes it simple to settle up with housemates, trips, and groups.
            </p>
            <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
              <Link
                to="/register"
                className="flex items-center justify-center rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-600/20 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-600/30 active:translate-y-0"
              >
                Get Started for Free
              </Link>
              <Link
                to="/login"
                className="flex items-center justify-center rounded-xl border-2 border-blue-200 bg-transparent px-8 py-4 text-base font-bold text-slate-700 transition-all hover:border-blue-300 hover:bg-blue-100/50"
              >
                Log in to account
              </Link>
            </div>
          </div>

          {/* Visual/Hero Graphic */}
          <div className="relative hidden lg:block">
            {/* Background blur blobs */}
            <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-blue-400/30 blur-3xl"></div>
            <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl"></div>

            {/* Main Mockup Card */}
            <div className="relative mx-auto w-full max-w-md rounded-3xl border border-white/50 bg-white/80 p-6 shadow-2xl backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Trip to Bali</h3>
                  <p className="text-sm text-slate-500">You owe <span className="font-semibold text-red-500">₹12,450</span></p>
                </div>
                <div className="flex -space-x-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-blue-100 text-sm font-bold text-blue-700">A</div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-indigo-100 text-sm font-bold text-indigo-700">J</div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-emerald-100 text-sm font-bold text-emerald-700">S</div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Expense Item 1 */}
                <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-xl">🍕</div>
                    <div>
                      <p className="font-semibold text-slate-900">Dinner at Luigi's</p>
                      <p className="text-xs text-slate-500">Alex paid ₹3,200</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">₹3,200</p>
                  </div>
                </div>

                {/* Expense Item 2 */}
                <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl">🚕</div>
                    <div>
                      <p className="font-semibold text-slate-900">Uber to Airport</p>
                      <p className="text-xs text-slate-500">You paid ₹850</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">₹850</p>
                  </div>
                </div>

                {/* Expense Item 3 */}
                <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-xl">🏠</div>
                    <div>
                      <p className="font-semibold text-slate-900">Airbnb</p>
                      <p className="text-xs text-slate-500">Sarah paid ₹24,000</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">₹24,000</p>
                  </div>
                </div>
              </div>

              <button className="mt-6 w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800">
                Add an expense
              </button>
            </div>

            {/* Floating Element */}
            <div className="absolute -right-8 top-12 animate-bounce rounded-2xl border border-white/40 bg-white/60 p-4 shadow-xl backdrop-blur-md" style={{ animationDuration: '3s' }}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Settled up</p>
                  <p className="text-sm font-bold text-slate-900">Sarah paid you ₹4,500</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
