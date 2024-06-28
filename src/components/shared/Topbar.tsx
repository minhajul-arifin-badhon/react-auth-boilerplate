import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList
} from '@/components/ui/navigation-menu';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Link, useNavigate } from 'react-router-dom';
import { useSignOutAccount } from '@/lib/react-query/queries';
import { useUserContext } from '@/context/AuthContext';
import { useEffect } from 'react';
// import { NavigationMenuItem } from '@radix-ui/react-navigation-menu';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';

export default function Topbar() {
    const navigate = useNavigate();
    const { mutate: signOut, isSuccess } = useSignOutAccount();
    const { user } = useUserContext();

    const menuItems = [
        {
            label: 'Product',
            path: '#'
        },
        {
            label: 'Features',
            path: '#'
        },
        {
            label: 'Pricing',
            path: '#'
        },
        {
            label: 'Company',
            path: '#'
        }
    ];

    useEffect(() => {
        if (isSuccess) navigate(0);
    }, [isSuccess, navigate]);

    return (
        <div className="w-full shadow-md">
            <nav className="mx-auto flex h-20 max-w-7xl shrink-0 flex-wrap items-center justify-between px-6 md:px-8">
                <a href="#" className="flex items-center">
                    <img
                        src="assets/images/logo.png"
                        className="mr-3 h-6 sm:h-9"
                        alt="Flowbite Logo"
                    />
                    <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                        React Auth
                    </span>
                </a>

                <div className="flex flex-row">
                    <NavigationMenu className="hidden md:flex">
                        <NavigationMenuList className="gap-x-6">
                            {menuItems.map((item) => (
                                <NavigationMenuItem key={item.label}>
                                    <NavigationMenuLink href={item.path}>
                                        <Button variant="ghost" className="header-nav-item">
                                            {item.label}
                                        </Button>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="md:hidden">
                                <HamburgerMenuIcon />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <Link to="/">
                                <HamburgerMenuIcon />
                                <span className="sr-only">React Auth</span>
                            </Link>
                            <div className="grid gap-2 py-6">
                                {menuItems.map((item) => (
                                    <Link
                                        to={item.path}
                                        key={item.label}
                                        className="flex w-full items-center py-2 text-lg font-semibold"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>

                    <div className="flex pl-8">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <Avatar className="size-9">
                                        <AvatarImage src={user.imageUrl} />
                                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="sr-only">Toggle user menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <div className="flex items-center gap-4 p-4">
                                    <Avatar className="size-8">
                                        <AvatarImage src={user.imageUrl} />
                                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="grid gap-0.5 leading-none">
                                        <div className="text-sm">{user.name}</div>
                                        <div className="text-sm">{user.email}</div>
                                    </div>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="pl-16">
                                    <Link to="#" className="text-base" onClick={() => signOut()}>
                                        Sign out
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </nav>
        </div>
    );
}
