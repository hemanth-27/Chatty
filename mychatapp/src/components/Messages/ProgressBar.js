import React from 'react';
import { Progress } from 'semantic-ui-react';

const ProgressBar = ({uploadState, percentUploaded}) => (
    uploadState && (
        <Progress className='progress__bar' percent={percentUploaded} inverted
        progress indicating size='medium'/>
    )
)

export default ProgressBar;