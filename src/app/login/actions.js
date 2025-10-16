  'use server'
  export async function submitLogin(e){
        const data = {
          email : e.get('email'),
          password : e.get('password')
        }

        console.log(email, password)

    }