const express=require('express')
const bodyParser=require('body-parser')

const app = express()
app.use(bodyParser.json())

class Node{
    constructor(data){
        this.data=data;
        this.next=null;
        this.prev=null;
    }
}

class DLL{
    constructor(){
        this.head=null;
        this.tail=null;
        this.size=0;
    }

    enqueue(data){
        const newNode=new Node(data);
        if(!this.head){
            this.head=newNode;
            this.tail=newNode;
        }
        else{
            this.tail.next=newNode;
            newNode.prev=this.tail;
            this.tail=newNode;
        }
        this.size++;
    }
    
    normallyGet(){
        if(!this.head){
            return null;
        }
        return this.head.data;
    }

    dequeue(){
        if(!this.head){
            return null;
        }

        const temp=this.head.data;
        this.head=this.head.next;
        this.head.prev=null;
        this.size--;
        return temp;
    }
    toArray() {
        let current = this.head;
        const result = [];
        while (current) {
            result.push(current.data);
            current = current.next;
        }
        return result;
    }
}


const queue= new DLL();

app.post('/add',function(req,res){
    const user=req.body;
    queue.enqueue(user);
    res.status(200).json({
        message:"we've got the user in message queue",
        queue: queue.toArray()
    })
})

app.get('/fetch',function(req,res){
    const user=queue.normallyGet();
    if(!user){
        res.status(404).json({
            message:"couldn't find user in message queue",
            queue: queue.toArray()
        })
    }
    res.status(200).json({
        message:"fetched user from message queue",
        queue: queue.toArray()
    })
})

app.get('/removeInOrder',function(req,res){
    const user=queue.dequeue();
    if(!user){
        res.status(404).json({
            message:"no user in message queue",
            queue: queue.toArray()
        })
    }
    res.status(200).json({
        user,
        message:"User removed from message queue",
        queue: queue.toArray()
    })
})


app.get('/size',function(req,res){
    res.status(200).json({
        message:"Size of message queue",
        size: queue.size
    })
}) 

app.listen(3000,()=>{
    console.log("Listening on port 3000")
})