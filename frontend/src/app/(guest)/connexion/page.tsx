import SignInForm from "./_components/SignInForm";

export default function SignInPage() {
  return (
    <div className="fixed inset-0 min-h-screen bg-[#EEF3F6] flex items-center justify-center px-4">
      <div className="bg-white text-gray-800 rounded-2xl shadow-md w-full max-w-md p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-mono text-center text-[#C62828] mb-6">
          Connexion
        </h1>

        <SignInForm />
      </div>
    </div>
  );
}
