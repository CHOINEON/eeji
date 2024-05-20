



## cloudfnt-web service의 배포 가이드
> 작성자: Dongin Shin (dongin@ineeji.com)


이 문서를 작성하는 시점에 cloudfnt-web의 React BFF (Backend For Frontend) server는 Google Cloud의 VM instance에서 Google Kubernetes Engine (GKE)의 pod로 migration 되었습니다.
deployment를 automation하기 위해서 github action workflows를 사용합니다.

PR author가 자신의 수정 사항이 main branch에 merge될 때 새로운 배포가 진행되기를 원하는 경우 PR에 **deploy/ci.json 파일에 대한** 수정이 포함되어야 합니다.

### ci.json 수정 방법
ci.json은 아래와 같이 JSON format으로 구성된 파일이며, 여기에서 version에 해당하는 value는 YYYYMMDDR{RevisionNum}의 형식을 갖습니다.
따라서, 배포하는 날짜와 해당 날짜에 1부터 시작하는 revision number를 명기합니다. 다른 값들은 변경하지 않습니다.
```
{
  "service": "cloudfnt-web",
  "version": "20240503R5",
  "dockerfile": "./Dockerfile"
}
``` 
해당 PR이 merge되면 새로운 github aciton 하나가 trigger됩니다. 
이 action이 정상적으로 수행되면, 두 가지를 확인할 수 있습니다.

#### 첫째는 Google Artifact Registry에 docker image가 upload 됩니다.
이 문서를 작성하는 시점에는 github action에 slack notification step이 추가되어 있지 않기 때문에 action을 눈여겨보지 않는다면 성공인지/실패인지를 알 수 없습니다. 

> WANTED: slack notification github action steps을 추가할 (warrier)를 모집합니다!

따라서 **반드시** [repository](https://console.cloud.google.com/artifacts/docker/ineeji-cloudai-test/asia-northeast3/cloudai-cloudfnt-web/cloudfnt-web?project=ineeji-cloudai-test)에 자신이 방금 올린
tag 명을 가진 - 뒤에 git_hash 가 붙습니다. - 이미지가 있어야 합니다. 

#### 둘째는 검증계 Kubernetes cluster에 해당 version의 image로 배포된 cloudfnt-web-test deployment resource가 rollout 되어 있습니다.
확인 방법은 아래와 같습니다. 
첫째로 kubectl, gcloud 이 설치되어 있어야 하며, 다음으로는 검증계 kubernetes cluster에 접속하기 위해서 아래의 명령어를 수행해야 합니다. 

```
# 검증계 kubernetes cluster에 접속하기 위해서 credentials (.kubeconfig)을 다운로드 합니다.
$ gcloud container clusters get-credentials gke-primary-ineeji-cloudai-test --zone asia-northeast3-a --project ineeji-cloudai-test

$ kubectl get deploy/cloudfnt-web-test -o wide
NAME                READY   UP-TO-DATE   AVAILABLE   AGE    CONTAINERS     IMAGES                                                                                                     SELECTOR
cloudfnt-web-test   1/1     1            1           3h9m   cloudfnt-web   asia-northeast3-docker.pkg.dev/ineeji-cloudai-test/cloudai-cloudfnt-web/cloudfnt-web:20240503R5__fa32ae8   app.kubernetes.io/instance=eeji-cloudfnt-web-test,app.kubernetes.io/name=cloudfnt-web
```
IMAGES에 version으로 시작하는 이름이 있으면 성공적으로 배포된 것입니다.

다음에는 운영계에 배포하는 방법을 정리합니다. To Be Added.

### Troubleshooting guide

#### GCP project의 리소스 접근 권한 필요
예로서, 리소스에 대한 추가 액세스 권한 필요하거나 projects/ineeji-cloudai-test/locations/asia-northeast3/repositories/cloudai-cloudfnt-web
gcloud container clusters 명령시 
```
실행시 ERROR: (gcloud.container.clusters.get-credentials) ResponseError: code=403, message=Required "container.clusters.get" permission for "projects/ineeji-cloudai-test/zones/us-northeast3-a/clusters/gke-primary-ineeji-cloudai-test".
```
에러에 대해서 GCP 사용자 계정에 적절한 권한이 부여되지 않은 경우입니다.
이때는 Terraform IaC를 적절한 권한을 부여하는 PR을 생성하고 solution-infra (CSI) team에게 review를 받습니다.

[예제 PR](https://github.com/INEEJI/iac-terraform-infra/pull/38)을 참고합니다.



