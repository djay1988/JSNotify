# Notify

Nofify is a Alert message library with jQuery and bootstrap 4


Install the dependencies and devDependencies and start the server.

Simple Alert
```sh
// types : success , danger, info
var alert = new Notify({message, type, autoClose});
alert.present();
```
Confirm with alert
```sh
var config = {
            message: "Are you want to delete ?", 
            msgType:'confirm',
            buttons:[
                {
                    text:"OK",
                    cssClass:'btn btn-sm btn-primary',
                    action:function(){
                        let alert = new Notify("Deleting data...",'loading');
                        <!-- Do Ajax or Some other Code-->
                    }
                }
            ]
        }
var alert = new Notify(config);
alert.present();
```

Progress with alert
```sh
var alert = new Notify("Updating data...",'loading');
alert.present();

// after
alert.update(data.message,'success');
```
