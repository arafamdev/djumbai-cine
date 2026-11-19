import Header from "./components/layout/Header";

function App() {
  return (
    <>
      <Header />

      <main className="flex min-h-screen items-center justify-center bg-background px-6 pt-20">
        <div className="max-w-xl text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-primary">
            Your next movie starts here
          </p>

          <h1 className="mb-5 text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl">
            Djumbai <span className="text-primary">Cine</span>
          </h1>

          <p className="mx-auto max-w-lg text-base leading-7 text-muted">
            Descobre novas histórias, explora os melhores filmes e encontra a
            tua próxima experiência cinematográfica.
          </p>
        </div>
      </main>
    </>
  );
}

export default App;
