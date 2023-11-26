
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { format} from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { useState } from "react"
import { createClient } from '@/lib/supabase/server'
import {cookies} from "next/headers"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useDebouncedCallback } from 'use-debounce';
import DarkModeToggle from "@/components/DarkModeToggle"

const cookie_store = cookies();
const supabase = createClient(cookie_store);

export function SigningTabs() {
  const [signInEmail, setSignInEmail] = useState("")
  const [signInPassword, setSignInPassword] = useState("")

  const [signUpEmail, setSignUpEmail] = useState("")
  const [signUpEmailError, setSignUpEmailError] = useState("")
  const debouncedEmail = useDebouncedCallback(
    // function
    async (value) => {
      //validate email
      const res = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.exec(value);
      const valid = !!res;
      
      if (!valid) {
        setSignUpEmailError("Please enter a valid email!")
        return
      }

      //check if email is taken
      const { data, error } = await supabase.from('users').select('email').eq('email', value)

      if (error) {
        setSignUpEmailError(error.message)
        return
      }

      if (data.length > 0) {
        setSignUpEmailError(`${value} is already taken!`)
        return
      }
      
      setSignUpEmailError("")
      setSignUpEmail(value);
    },
    // delay in ms
    1000
  );
  
  const [signUpPassword, setSignUpPassword] = useState("")
  const [signUpPasswordConfirm, setSignUpPasswordConfirm] = useState("")
  const [signUpName, setSignUpName] = useState("")

  const [signUpUsername, setSignUpUsername] = useState("")
  const [signUpUsernameError, setSignUpUsernameError] = useState("")
  const debouncedUsername = useDebouncedCallback(
    // function
    async (value) => {
      //validate username
      const res = /^[a-z0-9_\.]+$/.exec(value);
      const valid = !!res;
      
      if (!valid) {
        setSignUpUsernameError("Username must only contain lowercase letters, numbers, underscores and periods!")
        return
      }

      //check if username is taken
      const { data, error } = await supabase.from('users').select('username').eq('username', value)

      if (error) {
        setSignUpError(error.message)
        return
      }

      if (data.length > 0) {
        setSignUpUsernameError(`${value} is already taken!`)
        return
      }
      
      setSignUpUsernameError("")
      setSignUpUsername(value);
    },
    // delay in ms
    1000
  );


  const [signUpError, setSignUpError] = useState("")
  const [signUpSuccess, setSignUpSuccess] = useState(false)
  const [signInError, setSignInError] = useState(false)
  const [signInSuccess, setSignInSuccess] = useState(false)

  const [date, setDate] = useState<Date>()

  async function signUpWithEmail() {

    if (signUpPassword !== signUpPasswordConfirm) {
      setSignUpError("Passwords do not match!")
      return
    }

    if (signUpPassword.length < 8) {
      setSignUpError("Password must be at least 8 characters long!")
      return
    }

    if (date === undefined) {
      setSignUpError("Please enter your birthday!")
      return
    }

    //check if age is atleast 16 
    const today = new Date()
    const birthDate = new Date(date)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    if (age < 16) {
      setSignUpError("You must be atleast 16 years old to use Wessenger!")
      return
    }

    if (signUpUsernameError !!== "" || signUpEmailError !== "") {
      return
    }

    const { data, error } = await supabase.auth.signUp(
      {
        email: signUpEmail,
        password: signUpPassword,
      }
    )

    if (error) {
      setSignUpError(error.message)
      return
    }
    
    if (data) {
      //check
      
      //send data to user table
      const firstName = signUpName.split(" ")[0]
      const lastName = signUpName.split(" ").slice(1).join(" ")
      console.log(lastName)

      const { data, error } = await supabase.from('users').insert([
        { email: signUpEmail, username: signUpUsername, first_name: firstName, last_name: lastName, date_of_birth: date }
      ])

      if (error) {
        setSignUpError(error.message)
        return
      }
    }
    setSignUpError("")
    setSignUpSuccess(true)
  }




  return (
    <Tabs defaultValue="signin" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="signin">
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Log in using your email and password.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            
            {signInError && <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Email or Password is incorrect.
              </AlertDescription>
            </Alert>}

            {signInSuccess && <Alert variant="default">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                You have successfully signed in!
              </AlertDescription>
              </Alert>
            } 
            
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input required id="name" type="email" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSignInEmail(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input required id="password" type="password"  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSignInPassword(e.target.value)}/>
            </div>
          </CardContent>
          <CardFooter>
            <Button  onClick={() => signInWithEmail()}>Sign In</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="signup">
        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Sign Up for Wessenger to start chatting with your mates!.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">

            {signUpError !== "" && <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {signUpError}
              </AlertDescription>
            </Alert>}
            {!signUpError && signUpSuccess && <Alert variant="default">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                You have successfully signed up! Please check your email to verify your account.
              </AlertDescription>
              </Alert>
            }

            <div className="space-y-1">
              <Label htmlFor="current">Full Name</Label>
              <Input required type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSignUpName(e.target.value)}/>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="current">Username</Label>
              {signUpUsernameError && <p className={" text-red-500 underline text-xs p-1 rounded  border-red-500  border text-center "}>{signUpUsernameError}</p>}
              <Input required id="username" onChange={(e: React.ChangeEvent<HTMLInputElement>) => debouncedUsername(e.target.value)}/>
            </div>
            <div className="space-y-1">
              <Label htmlFor="current">Age</Label>
              <Popover >
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1">
              <Label htmlFor="current">Email</Label>
              {signUpEmailError && <p className={" text-red-500 underline text-xs p-1 rounded  border-red-500  border text-center "}>{signUpEmailError}</p>}
              <Input required id="email" type="email" onChange={(e: React.ChangeEvent<HTMLInputElement>) => debouncedEmail(e.target.value)}/>
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New Password</Label>
              <Input required id="new-password" type="password" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSignUpPassword(e.target.value)}/>
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">Re-enter Password</Label>
              <Input required id="re-enter password" type="password" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSignUpPasswordConfirm(e.target.value)} />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => signUpWithEmail()}>Sign Up</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

export default function Home() {
    //if user signout redirect to home
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        window.location.href = "/signing"
      }
    })
  
  
    
    
    return (
      <main className="flex h-screen w-screen flex-row items-center justify-between dark:text-white text-black">
        <div className={`flex flex-col h-full w-[65%] justify-center items-center border-r border-opacity-30 dark:border-white border-black dark:bg-stone-950 bg-stone-50`}>
            <DarkModeToggle className={"absolute top-5 left-5"} />
            <h1 className={"flex flex-row text-9xl w-full justify-center font-thin items-center p-8"}>
                WESSENGER
            </h1>
            <h2 className={"flex flex-row text-4xl w-full justify-end font-thin items-center pr-12"}>
                  It's like WeChat, but Messenger
            </h2>
        </div>
        
        <div className={"flex flex-col h-full w-[35%] justify-center items-center"}>
          <SigningTabs />
        </div>
      </main>
    )
  }