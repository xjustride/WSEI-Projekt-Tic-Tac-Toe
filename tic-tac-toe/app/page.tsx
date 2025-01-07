export default function HomePage() {
    return (
      <main className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-4xl font-bold mb-4 text-white">Gra Tic Tac Toe</h1>
        <p className="text-lg mb-4 text-white">Projekt Frameworki Frontendowe</p>
        <p className="text-md text-white">Autor: Krupa Remigiusz</p>
        <p className="text-md text-white">Informatyka stosowana</p>
        <p className="text-md text-white">Nr. albumu: 14531</p>
        <div className="flex space-x-4 mt-4">
          <a href="/login" className="bg-blue-500 text-white py-2 px-4 rounded">Logowanie</a>
          <a href="/register" className="bg-green-500 text-white py-2 px-4 rounded">Rejestracja</a>
        </div>
      </main>
    );
  }
  