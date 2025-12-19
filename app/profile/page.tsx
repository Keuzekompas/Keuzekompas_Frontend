import { UserIcon } from '@heroicons/react/24/outline';

const user = {
  name: 'Sietse',
  studentNumber: '1234567',
  email: 'sietse.demo@avans.nl',
};

const ProfilePage = () => {
  return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 text-center text-(--text-primary)">Profiel</h2>
        <div className="flex items-center mb-4 text-(--text-primary)">
          <UserIcon className="w-12 h-12 mr-4" />
          <h3 className="text-2xl font-bold">{user.name}</h3>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-(--text-primary)">
            <span className="font-medium">Studentnummer</span>
            <span className="px-4 py-1 bg-(--bg-input) rounded-full">{user.studentNumber}</span>
          </div>
          <div className="flex justify-between items-center text-(--text-primary)">
            <span className="font-medium">E-mail</span>
            <span className="px-4 py-1 bg-(--bg-input) rounded-full">{user.email}</span>
          </div>
        </div>
      </div>
  );
};

export default ProfilePage;
