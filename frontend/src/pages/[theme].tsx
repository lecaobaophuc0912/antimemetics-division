import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from "next/image";
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';

// Định nghĩa các theme có sẵn
const themes = {
  neural: {
    background: 'bg-gradient-to-br from-green-500 to-cyan-500',
    text: 'text-white',
    name: 'NEURAL'
  },
  quantum: {
    background: 'bg-gradient-to-br from-pink-500 to-purple-500',
    text: 'text-white',
    name: 'QUANTUM'
  },
  cyber: {
    background: 'bg-gradient-to-br from-cyan-500 to-blue-500',
    text: 'text-white',
    name: 'CYBER'
  },
  matrix: {
    background: 'bg-gradient-to-br from-yellow-500 to-orange-500',
    text: 'text-white',
    name: 'MATRIX'
  },
  void: {
    background: 'bg-gradient-to-br from-gray-500 to-gray-700',
    text: 'text-white',
    name: 'VOID'
  },
  plasma: {
    background: 'bg-gradient-to-br from-purple-500 to-pink-500',
    text: 'text-white',
    name: 'PLASMA'
  }
};

interface ThemePageProps {
  theme: string;
  themeConfig: {
    background: string;
    text: string;
    name: string;
  };
}

export default function ThemePage({ theme, themeConfig }: ThemePageProps) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const currentTheme = themeConfig;

  return (
    <ProtectedRoute>
      <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text} transition-colors duration-300`}>
        <div className="container mx-auto px-4 py-8">
          {/* User Info and Logout */}
          <div className="flex justify-between items-center mb-8">
            <div className="text-left">
              <h1 className="text-2xl font-bold">Welcome to {currentTheme.name} Theme!</h1>
              <p className="opacity-80">Logged in as: {user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-black bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-200"
            >
              Logout
            </button>
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">
              Theme: {currentTheme.name}
            </h1>

            <div className="mb-8">
              <Image
                className="mx-auto mb-6"
                src="/next.svg"
                alt="Next.js logo"
                width={180}
                height={38}
                priority
              />
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Các theme có sẵn:</h2>
              <div className="flex flex-wrap gap-3 justify-center">
                {Object.entries(themes).map(([themeName, themeConfig]) => (
                  <button
                    key={themeName}
                    onClick={() => router.push(`/${themeName}`)}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${themeName === theme
                      ? 'ring-4 ring-white ring-opacity-50 font-bold'
                      : 'bg-black bg-opacity-20 hover:bg-opacity-30'
                      }`}
                  >
                    {themeConfig.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-black bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-200 hover:scale-105"
              >
                ← Về trang chủ
              </button>

              <div className="text-sm opacity-80">
                <p>URL hiện tại: /{theme}</p>
                <p>Background: {currentTheme.background}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

// Tạo static paths cho tất cả các theme
export const getStaticPaths: GetStaticPaths = async () => {
  console.log('🔍 getStaticPaths đang chạy....');


  const paths = Object.keys(themes).map((theme) => ({
    params: { theme },
  }));

  console.log('📁 Generated paths:', paths);

  return {
    paths,
    fallback: false, // Trả về 404 cho các theme không tồn tại
  };
};

// Tạo static props cho mỗi theme
export const getStaticProps: GetStaticProps = async ({ params }) => {
  console.log('🎯 getStaticProps đang chạy với params:', params);

  const theme = params?.theme as string;
  console.log('🔍 theme:', theme);
  if (!theme || !themes[theme as keyof typeof themes]) {
    console.log('❌ Theme không tồn tại:', theme);
    return {
      notFound: true,
    };
  }

  console.log('✅ Theme hợp lệ:', theme);

  return {
    props: {
      theme,
      themeConfig: themes[theme as keyof typeof themes],
    },
    revalidate: 10, // Revalidate mỗi 10 giây trong development
  };
}; 