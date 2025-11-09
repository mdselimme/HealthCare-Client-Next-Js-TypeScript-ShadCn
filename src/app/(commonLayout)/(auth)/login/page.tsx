import LogInForm from "@/components/modules/Auth/LogInForm";

const LogInPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ redirect?: string }>;
}) => {
  const { redirect } = (await searchParams) || {};

  return (
    <div>
      <LogInForm redirect={redirect} />
    </div>
  );
};

export default LogInPage;
