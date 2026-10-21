export default function LoadingExperience() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#090c11] text-[#dcecff]">
      <div className="flex flex-col items-center gap-5" role="status" aria-live="polite">
        <div className="n3d-loader" aria-label="Chargement de l’expérience Nexus">
          <span className="n3d-loader-point n3d-loader-point-top" />
          <span className="n3d-loader-point n3d-loader-point-left" />
          <span className="n3d-loader-point n3d-loader-point-right" />
        </div>
      </div>
    </main>
  );
}
