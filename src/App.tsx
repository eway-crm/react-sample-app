import React from 'react';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { ProgressIndicator } from 'office-ui-fabric-react/lib/ProgressIndicator';
import { mergeStyleSets } from 'office-ui-fabric-react';
import connection from './eWayAPI/Connector';
import { TContactsResopnse } from './eWayAPI/ContactsResponse';

const css = mergeStyleSets({
    loadingDiv: {
        width: '50vw',
        position: 'absolute',
        left: '25vw',
        top: '40vh'
    }
})

const dialogContentProps = {
    type: DialogType.normal,
    title: 'Agent Data',
    isDraggable: false
};

const modalProps = {
    isBlocking: true
};

// This is a React Hook component.
function App() {

    const [fullName, setFullName] = React.useState<string | null>(null);

    React.useEffect(() => {
        setTimeout(() => {
            connection.callMethod(
                'SearchContacts',
                {
                    transmitObject: {
                        Email1Address: 'mroyster@royster.com'
                    },
                    includeProfilePictures: false
                },
                (result: TContactsResopnse) => {
                    if (result.Data.length !== 0 && !!result.Data[0].FileAs) {
                        setFullName(result.Data[0].FileAs);
                    } else {
                        setFullName('...top secret...');
                    }
                }
            );
        },
            5000
        );
    });

    return (
        <div>
            <Dialog
                hidden={!fullName}
                onDismiss={() => setFullName(null)}
                dialogContentProps={{ ...dialogContentProps, subText: `His/her name is ${fullName}.` }}
                modalProps={modalProps}
            >
                <DialogFooter>
                    <PrimaryButton onClick={() => window.location.href = 'https://www.eway-crm.com'} text="OK" />
                </DialogFooter>
            </Dialog>
            {(!fullName) &&
                <div className={css.loadingDiv}>
                    <ProgressIndicator label="Loading Agent Name" description="This tape will be destroyed after watching." />
                </div>
            }
        </div>
    );
}

export default App;
