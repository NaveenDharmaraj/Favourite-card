import { Breadcrumb } from 'semantic-ui-react';

export const generateBreadCrum = (breakCrumArray = [], currentActiveStepArray = []) => {
    return (
        <div className="flowBreadcrumb">
            <Breadcrumb size="mini">
                {
                    breakCrumArray.map((item, i) => {
                        return (
                            <>
                                <Breadcrumb.Section
                                    className={currentActiveStepArray.includes(i + 1) && 'completed_step'}
                                    active={currentActiveStepArray.length === i + 1}
                                >
                                    {item}
                                </Breadcrumb.Section>
                                <Breadcrumb.Divider icon='right chevron' />
                            </>
                        )
                    })
                }
            </Breadcrumb>
        </div>
    )
}