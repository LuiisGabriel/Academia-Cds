import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Logo from '../assets/LOGO.png'
import { APP_ROUTES } from '../utils/constants';
import { useUser } from '../lib/customHooks';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultProfilePhoto from '../assets/profile.png';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {

  const { user, authenticated } = useUser();
  const [profilePhoto, setProfilePhoto] = useState('');
  const photoUrl = user?.photo?.url;
  const navigation = [];
  const navigate = useNavigate();
  const navColor = "#1f2937"


  useEffect(() => {
    if (photoUrl == null) {
      setProfilePhoto(defaultProfilePhoto);
    }
    else {
      setProfilePhoto(photoUrl);
    }
  }, [photoUrl]);

  if (!user || !authenticated) {
    return <div className="p-16 bg-gray-300 h-screen flex justify-center items-center">
      <div className="ml-2 w-8 h-8 border-l-2 rounded-full animate-spin border-white" />
    </div>;
  }

  if (user.role == 'ADMIN') {
    navigation.splice(0, navigation.length);
    navigation.push(
      { name: 'Página inicial', href: APP_ROUTES.ADMIN_HOME_PAGE },
      { name: 'Treinamentos', href: APP_ROUTES.TRAINMENTS },
      { name: 'Avaliações', href: APP_ROUTES.VALUATIONS },
      { name: 'Cadastros', href: APP_ROUTES.REGISTERS },
      { name: 'Relatórios', href: APP_ROUTES.REPORTS },
    )
  }

  if (user.role == 'USER') {
    navigation.splice(0, navigation.length);
    navigation.push(
      { name: 'Página inicial', href: APP_ROUTES.USER_HOME_PAGE },
      { name: 'Treinamentos', href: APP_ROUTES.TRAINMENTS },
      { name: 'Avaliações', href: APP_ROUTES.VALUATIONS },
    )
  }

  function logout(e) {
    e.preventDefault();
    localStorage.removeItem('token');
    navigate(APP_ROUTES.LANDINGPAGE);
  }

  return (
    <Disclosure
      as="nav"
      className='bg-(--color) select-none'
      style={{
        '--color': user.role == 'ADMIN' ? "#991b1b" : navColor,
      }}
    >
      <div className=" px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16  items-center justify-between ">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center pr-8">
              <a>
                <img
                  alt="CDS Sistemas"
                  src={Logo}
                  className="h-10 w-auto"
                />
              </a>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex items-center space-x-4">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className='text-white hover:scale-105 rounded-md px-3 py-2 text-sm font-semibold transition-all duration-300 ease-in-out'
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 ">
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className=" transition-all duration-300 ease-in-out relative flex rounded-full bg-gray-800 text-sm hover:scale-105 focus:ring-offset-gray-800 focus:outline-hidden">
                  <span className="absolute -inset-1.5" />
                  <img
                    alt={photoUrl}
                    src={profilePhoto}
                    className="size-8 rounded-full"
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-500 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
              >
                <MenuItem>
                  <a
                    href={APP_ROUTES.PROFILE}
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Perfil
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                    onClick={logout}
                  >
                    Sair
                  </a>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              className={classNames(
                item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'block rounded-md px-3 py-2 text-base font-medium',
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
