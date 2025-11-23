import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl space-y-6">
      <section className="rounded-2xl bg-base-100 p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Profile</h2>
        <div className="mt-4 grid gap-4">
          <div>
            <p className="text-sm text-base-content/70">Name</p>
            <p className="text-lg font-medium">{user?.name}</p>
          </div>
          <div>
            <p className="text-sm text-base-content/70">Email</p>
            <p className="text-lg font-medium">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-base-content/70">Role</p>
            <div className="badge badge-primary badge-lg">{user?.role}</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
